---
title: ch2 - Data models and query languages
---
## Databases
There are different databases but there are two types that are the most famous.
### SQL vs NoSQL Databases
#### 🗃️ SQL Databases (Relational)
- **Structure**: Use tables with rows and columns.
- **Schema**: Fixed schema, data must follow a predefined structure.
- **Relationships**: Use foreign keys and JOINs.
- **Examples**: `PostgreSQL`, `MySQL`, `SQLite`, `SQL Server`.
- **Best for**: Structured data, strong consistency, complex queries.

#### 📦 NoSQL Databases (Non-relational)
- **Structure**: Flexible formats – documents, key-value, graphs, or wide-columns.
- **Schema**: Schema-less or dynamic schema.
- **Relationships**: Usually denormalized, no JOINs.
- **Examples**: `MongoDB` (Document), `Redis` (Key-Value), `Cassandra` (Wide-Column), `Neo4j` (Graph).
- **Best for**: Unstructured or semi-structured data, high scalability, fast performance.

## Impedance Mismatch (Object-Relational)
**Impedance mismatch** refers to the disconnect between **object-oriented programming (OOP)** and **relational databases (SQL)**.

### Why it happens
Object-oriented apps use **classes and nested objects**, while relational databases use **tables and foreign keys**. These two paradigms don't map naturally to each other.
## Many-to-One and Many-to-Many Relationships
Suppose you have a student table that contains the information about your subjects and your teachers. So in your student table you can have the columns, id, name, subjects and teacher, and the columns `subjects` and `teacher` are simple string values. This is a problem because you have the same data several times. Many students have the same teacher and the same subject. So we split our data into tables, for example student_courses and course table and now you can relate the tables through ID.

| **ID** | **Name** | **Course**  | **Teacher**   |
| ------ | -------- | ----------- | ------------- |
| 1      | Ana      | Mathematics | Prof. Gomez   |
| 2      | Juan     | History     | Prof. Ramirez |
| 3      | Ana      | History     | Prof. Ramirez |

**Students_Courses Table**

| **ID** | **Name** | **Course_ID** |
| ------ | -------- | ------------- |
| 1      | Ana      | 1             |
| 2      | Juan     | 2             |
| 3      | Ana      | 2             |

**Courses Table**

|**Course_ID**|**Course**|**Teacher**|
|---|---|---|
|1|Mathematics|Prof. Gomez|
|2|History|Prof. Ramirez|

With this approach, not only is the information not repeated, but the data is standardized in case it changes in the future. If we need to change a `teacher` of a `subject`, we only have to modify one table and it will be reflected everywhere. On the other hand, if we had only 1 table with the `teacher column` as a simple string, we would have to change in all the rows where it was repeated.

> • One **student** can enroll in many **courses**
> • One **course** can have many **students**

In the 70s the most popular database was `IBM IMS` that work well with `one-to-many` relationships but it made `many-to-many` relationships difficult and it didn’t support joins.

> JOINS in relational databases are a way of combining rows from two or more tables based on a condition related to each other, usually a foreign key and a primary key.

Various solutions were proposed to solve the limitations of the hierarchical model. But two was the most prominent.

### The network model AKA CODASYL model
In this model a record could have multiple parents. This allowed many-to-one and many-to-many relationships to be modeled. The model use `access path` that allow you go through `"link list"` because the only way for access to the records is follow the path from a root record along these chains of links.

### The relational model
More simple. Just `tables` an `rows`. A relation (table) is simply a collection of tuples (rows), and that’s it. Instead of follow long nested path the relational model use `foreign keys` and `primary key` for access and ensure data.

> A **foreign key** is a field in one table that links to the **primary key** of another table. It creates a relationship between the two tables and ensures **referential integrity**, meaning the value in the foreign key must exist in the other table.

## Schema flexibility in the document model
In general, `document databases` do not guarantee schema validation, which means that, for example, different types of data, such as a `string` or a `number`, can be entered in a field.

Relational databases, on the other hand, do. For this reason, document databases are also called `schema-on-read` (the data structure of is implicit and is only interpreted when the data is read) and relational databases `schema-on-write`(the schema is explicit and the database ensures all written data conforms to it).

`Schema-on-read` databases are useful in situations where applications need the data format to change. For example you need to change your fields so that the user name is now separated by `first_name` and `last_name` (before it was all in `name`). You can simply add these new fields to your document and manage at the app level those old documents that had the name in the name field.
```ruby
if user && user.name && !user.first_name
	user.first_name = user.name.split(" ")[0]
end
```

On the other hand, in a relational database schema, you would typically perform a migration along the lines of:
```sql
ALTER TABLE users ADD COLUMN first_name text:
UPDATE users SET first_name = split_part(name, ' ', 1) -- PostgreSQL
```

The schema-on-read approach is advantageous if the items in the collection don’t all have the same structure for some reason:

- There are many different types of objects, and it is not practical to put each type of object in its own table.
- The structure of the data is determined by external systems over which you have no control and which may change at any time.

But in cases where all records are expected to have the same structure, schemas are a useful mechanism for documenting and enforcing that structure.
## Data locality for queries
A document is usually stored as a single continuous string, encoded as JSON, XML, or a binary variant thereof (such as MongoDB’s BSON). If your application often needs to access the entire document (for example, to render it on a web page), there is a performance advantage to this storage `locality`.

The locality advantage only applies if you need large parts of the document at the same time. The database typically needs to load the entire document, even if you access only a small portion of it, which can be wasteful on large documents. On updates to a document, the entire document usually needs to be rewritten.
# Query Languages for Data
IMS and CODASYL queried the database using imperative code.
```js
function getSharks() {
	var sharks = []
	for (var i = 0; i < animals.lengthLL i++) {
		if (animals[i].family === "Sharks") {
			sharks.push(animals[i])
		}
	}
	return sharks
}
```

By other hand, SQL use a declarative language based on the structure of relational algebra.
$\textit{sharks} = \sigma_{\textit{family} = "Sharks"}(\textit{animals})$
```sql
SELECT * FROM animals WHERE family = 'Sharks'
```

## Graph-Like Data Models
In data with many-to-many complex relationships its become more natural to start modeling your data as a graph.

> A graph consists of two kinds of objects: vertices (also known as nodes or entities) and edges (also known as relationships or arcs).
