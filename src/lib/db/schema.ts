import {
  mysqlTable,
  int,
  varchar,
  text,
  decimal,
  datetime,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

export const autores = mysqlTable('Autores', {
  ID_Autor:      int('ID_Autor').primaryKey().autoincrement(),
  Nombre_Autor:  varchar('Nombre_Autor', { length: 255 }).notNull(),
  Nacionalidad:  varchar('Nacionalidad', { length: 100 }),
});

export const categorias = mysqlTable('Categorias', {
  ID_Categoria:     int('ID_Categoria').primaryKey().autoincrement(),
  Nombre_Categoria: varchar('Nombre_Categoria', { length: 255 }).notNull(),
  Descripcion:      text('Descripcion'),
});

export const clientes = mysqlTable('Clientes', {
  ID_Cliente:      int('ID_Cliente').primaryKey().autoincrement(),
  Nombre_Cliente:  varchar('Nombre_Cliente', { length: 255 }).notNull(),
  Correo:          varchar('Correo', { length: 255 }),
  Telefono:        varchar('Telefono', { length: 20 }),
  Direccion:       varchar('Direccion', { length: 500 }),
  Fecha_Registro:  datetime('Fecha_Registro'),
});

export const libros = mysqlTable('Libros', {
  ID_Libro:         int('ID_Libro').primaryKey().autoincrement(),
  ISBN:             varchar('ISBN', { length: 20 }).notNull(),
  Titulo:           varchar('Titulo', { length: 500 }).notNull(),
  Editorial:        varchar('Editorial', { length: 255 }),
  Anio_Publicacion: int('Anio_Publicacion'),
  Precio:           decimal('Precio', { precision: 10, scale: 2 }).notNull(),
  Stock:            int('Stock').default(0),
  ID_Categoria:     int('ID_Categoria'),
  ID_Autor:         int('ID_Autor'),
});

export const revistas = mysqlTable('Revistas', {
  ID_Revista:   int('ID_Revista').primaryKey().autoincrement(),
  ISSN:         varchar('ISSN', { length: 20 }).notNull(),
  Titulo:       varchar('Titulo', { length: 500 }).notNull(),
  Editorial:    varchar('Editorial', { length: 255 }),
  Frecuencia:   varchar('Frecuencia', { length: 50 }),
  Precio:       decimal('Precio', { precision: 10, scale: 2 }).notNull(),
  Stock:        int('Stock').default(0),
  ID_Categoria: int('ID_Categoria'),
});

export const pedidos = mysqlTable('Pedidos', {
  ID_Pedido:    int('ID_Pedido').primaryKey().autoincrement(),
  ID_Cliente:   int('ID_Cliente').notNull(),
  Fecha_Pedido: datetime('Fecha_Pedido'),
  Estado:       varchar('Estado', { length: 50 }).default('Pendiente'),
  Total:        decimal('Total', { precision: 10, scale: 2 }),
});

export const detallesPedido = mysqlTable('Detalles_Pedido', {
  ID_Detalle:      int('ID_Detalle').primaryKey().autoincrement(),
  ID_Pedido:       int('ID_Pedido').notNull(),
  Tipo_Producto:   mysqlEnum('Tipo_Producto', ['Libro', 'Revista']).notNull(),
  ID_Producto:     int('ID_Producto').notNull(),
  Cantidad:        int('Cantidad').notNull(),
  Precio_Unitario: decimal('Precio_Unitario', { precision: 10, scale: 2 }).notNull(),
});
