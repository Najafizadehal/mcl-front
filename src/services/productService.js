export async function fetchProducts() {
    const response = await fetch('http://localhost:8080/api/products');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }