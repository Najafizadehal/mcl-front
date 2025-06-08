export async function fetchProducts(type) {
    let url = 'http://localhost:8080/api/products';
    if (type) {
      url += `?type=${type}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }