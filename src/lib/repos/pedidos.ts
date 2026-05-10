import { db } from '../db.js';
import { mapPedido, mapDetalle, mapLibro, mapRevista } from '../mappers.js';
import { ApiError } from '../http.js';
import type { Pedido, DetallePedido, TipoProducto } from '../../types/index.js';

export interface CheckoutItem {
  tipo_producto: TipoProducto;
  id_producto: number;
  cantidad: number;
}

const productTable = (tipo: TipoProducto) =>
  tipo === 'Libro'
    ? { table: 'Libros', idCol: 'ID_Libro' }
    : { table: 'Revistas', idCol: 'ID_Revista' };

export async function checkout(id_cliente: number, items: CheckoutItem[]): Promise<number> {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    let total = 0;
    const enriched: Array<CheckoutItem & { precio: number }> = [];

    for (const it of items) {
      const { table, idCol } = productTable(it.tipo_producto);
      const [rows]: any = await conn.query(
        `SELECT Precio, Stock FROM ${table} WHERE ${idCol} = :id FOR UPDATE`,
        { id: it.id_producto }
      );
      const r = rows[0];
      if (!r) throw new ApiError(400, `${it.tipo_producto} ${it.id_producto} not found`);
      if (r.Stock < it.cantidad) {
        throw new ApiError(409, `Insufficient stock for ${it.tipo_producto} ${it.id_producto}`);
      }
      const precio = Number(r.Precio);
      enriched.push({ ...it, precio });
      total += precio * it.cantidad;
    }

    const [pedRes]: any = await conn.query(
      `INSERT INTO Pedidos (ID_Cliente, Estado, Total) VALUES (:id, 'Pendiente', :total)`,
      { id: id_cliente, total }
    );
    const id_pedido = pedRes.insertId as number;

    for (const it of enriched) {
      await conn.query(
        `INSERT INTO Detalles_Pedido (ID_Pedido, Tipo_Producto, ID_Producto, Cantidad, Precio_Unitario)
         VALUES (:p, :tipo, :idp, :cant, :precio)`,
        { p: id_pedido, tipo: it.tipo_producto, idp: it.id_producto, cant: it.cantidad, precio: it.precio }
      );
      const { table, idCol } = productTable(it.tipo_producto);
      await conn.query(
        `UPDATE ${table} SET Stock = Stock - :cant WHERE ${idCol} = :id`,
        { cant: it.cantidad, id: it.id_producto }
      );
    }

    await conn.commit();
    return id_pedido;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function findPedidoById(id: number): Promise<Pedido | null> {
  const [rows]: any = await db.query(
    `SELECT P.*, C.Nombre_Cliente, C.Correo
     FROM Pedidos P
     LEFT JOIN Clientes C ON C.ID_Cliente = P.ID_Cliente
     WHERE P.ID_Pedido = :id`,
    { id }
  );
  return rows[0] ? mapPedido(rows[0]) : null;
}

export async function findPedidosByCliente(id_cliente: number): Promise<Pedido[]> {
  const [rows]: any = await db.query(
    `SELECT * FROM Pedidos WHERE ID_Cliente = :id ORDER BY Fecha_Pedido DESC, ID_Pedido DESC`,
    { id: id_cliente }
  );
  return rows.map(mapPedido);
}

export async function findAllPedidos(): Promise<Pedido[]> {
  const [rows]: any = await db.query(
    `SELECT P.*, C.Nombre_Cliente, C.Correo
     FROM Pedidos P
     LEFT JOIN Clientes C ON C.ID_Cliente = P.ID_Cliente
     ORDER BY P.Fecha_Pedido DESC, P.ID_Pedido DESC`
  );
  return rows.map(mapPedido);
}

export async function findDetallesByPedido(id_pedido: number): Promise<DetallePedido[]> {
  const [rows]: any = await db.query(
    `SELECT * FROM Detalles_Pedido WHERE ID_Pedido = :id ORDER BY ID_Detalle`,
    { id: id_pedido }
  );
  const detalles: DetallePedido[] = rows.map(mapDetalle);

  const libroIds = detalles.filter(d => d.tipo_producto === 'Libro').map(d => d.id_producto);
  const revistaIds = detalles.filter(d => d.tipo_producto === 'Revista').map(d => d.id_producto);

  const libros: Record<number, any> = {};
  const revistas: Record<number, any> = {};

  if (libroIds.length) {
    const [lr]: any = await db.query(
      `SELECT L.*, A.Nombre_Autor, A.Nacionalidad, C.Nombre_Categoria
       FROM Libros L
       LEFT JOIN Autores A ON A.ID_Autor = L.ID_Autor
       LEFT JOIN Categorias C ON C.ID_Categoria = L.ID_Categoria
       WHERE L.ID_Libro IN (?)`,
      [libroIds]
    );
    for (const r of lr) libros[r.ID_Libro] = mapLibro(r);
  }
  if (revistaIds.length) {
    const [rr]: any = await db.query(
      `SELECT R.*, C.Nombre_Categoria
       FROM Revistas R
       LEFT JOIN Categorias C ON C.ID_Categoria = R.ID_Categoria
       WHERE R.ID_Revista IN (?)`,
      [revistaIds]
    );
    for (const r of rr) revistas[r.ID_Revista] = mapRevista(r);
  }

  for (const d of detalles) {
    d.producto = d.tipo_producto === 'Libro' ? libros[d.id_producto] : revistas[d.id_producto];
  }
  return detalles;
}

export async function updateEstadoPedido(id: number, estado: string): Promise<boolean> {
  const [res]: any = await db.query(
    `UPDATE Pedidos SET Estado = :estado WHERE ID_Pedido = :id`,
    { estado, id }
  );
  return res.affectedRows > 0;
}
