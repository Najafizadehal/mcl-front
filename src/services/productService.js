export async function fetchProducts(type) {
  let url = 'http://localhost:8081/api/products';
  if (type) {
    url += `?type=${encodeURIComponent(type)}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
