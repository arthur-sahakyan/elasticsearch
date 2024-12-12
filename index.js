const { Client } = require('@elastic/elasticsearch');

// Создаём клиент для подключения к Elasticsearch
const client = new Client({ node: 'http://127.0.0.1:9200' });


const run = async () => {
  try {
   // Create index if not exists
    const indexName = 'books';
    const exists = await client.indices.exists({ index: indexName });
    if (!exists) {
      await client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              title: { type: 'text' },
              author: { type: 'text' },
              year: { type: 'integer' },
            },
          },
        },
      });
      console.log(`Index "${indexName}" was created successfully.`);
    }
    
    //Adding documents
    const books = [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
      { title: '1984', author: 'George Orwell', year: 1949 },
    ];
    
    for (const [i, book] of books.entries()) {
      await client.index({
        index: indexName,
        id: i.toString(),
        body: book,
      });
    }
    console.log('Documents were added successfully.');
    
    // Update the indexes
    await client.indices.refresh({ index: indexName });
    
    // Search
    const { body } = await client.search({
      index: indexName,
      body: {
        query: {
          match: { title: 'great' },
        },
      },
    });
    
    console.log('Search results:', body.hits.hits);
  } catch (err) {
    console.error('Error:', err);
  }
};

(async () => {
  await run();
})();
