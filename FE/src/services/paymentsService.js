const BASE_URL = import.meta.env.VITE_BE_BASE_URL || 'http://localhost:3000'; 

export async function createSource(amount) {
  const response = await fetch(`${BASE_URL}/create-source`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });

  if (!response.ok) {
    throw new Error('สร้าง source ไม่สำเร็จ');
  }

  return await response.json();
}
