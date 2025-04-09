import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Choice, Outcome } from './types';

const genAI = new GoogleGenerativeAI('AIzaSyBiNwiiC0xFF6QfOZpST_izP8rQo704aTQ'); // ganti dengan key kamu
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Fungsi util untuk handle parsing JSON aman
function safeJsonParse(text: string) {
  try {
    // Bersihkan karakter Markdown seperti ```json atau ```
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Gagal parse JSON:', error, '\nRaw text:\n', text);
    throw new Error('Format JSON tidak valid dari Gemini.');
  }
}

export async function generateStory(genre: string) {
  const prompt = `
Buatkan cerita interaktif dalam bahasa Indonesia dan kamu adalah salah satu orang didalamnya ( kamu bertindak dengan sudut pandang orang ketiga ) dengan genre "${genre}".
Pastikan cerita memiliki perkembangan karakter yang menarik, konflik yang berkembang, dan twist yang tidak terduga.
Format JSON:
{
  "title": "Judul cerita",
  "opening": "Paragraf pembuka yang menggugah rasa penasaran",
  "conflict": "Konflik utama yang berkembang, bisa melibatkan pilihan moral atau ketegangan antar karakter, dengan elemen yang membuat cerita tidak terduga"
}
JANGAN tambahkan teks lain di luar JSON. JANGAN gunakan markdown atau tanda \`\`\`.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return safeJsonParse(text);
}

export async function generateChoice(genre: string, context: string): Promise<Choice> {
  const prompt = `
Berdasarkan cerita dengan genre "${genre}" dan konteks berikut:
"${context}"

Buat satu pilihan penting yang berkaitan dengan konflik, dengan konsekuensi besar terhadap perkembangan cerita, tetapi tidak mengulang konflik sebelumnya.
Pastikan pilihan tersebut mempengaruhi alur cerita dalam arah yang berbeda, seperti mempengaruhi hubungan antar karakter, moralitas, atau tujuan jangka panjang.
Format JSON:
{
  "text": "Situasi pilihan yang menantang dan beragam akibatnya",
  "options": ["Pilihan 1 yang memberikan kesempatan unik", "Pilihan 2 yang mengarah pada akibat tak terduga", "Pilihan 3 dengan hasil berbeda", "Pilihan 4 yang bisa mengubah arah cerita"]
}
Pastikan:
- options pada pilihan 1 sampai 4 tidak monoton akibatnya bisa bergantian untuk setiao konflik
- Pilihan tetap relevan dengan alur cerita.
- Tidak mengulang isi atau kata-kata dari konflik sebelumnya.
- TANPA teks tambahan, markdown, atau tanda \`\`\`.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return safeJsonParse(text);
}


export async function generateOutcome(
  genre: string,
  context: string,
  choice: string,
  option: string
): Promise<Outcome> {
  const prompt = `
Berdasarkan cerita dengan genre "${genre}", konteks:
"${context}"

Pemain memilih: "${option}" dari pilihan "${choice}".

Buat konsekuensi dalam format JSON:
{
  "text": "Deskripsi konsekuensi yang bisa mempengaruhi karakter, hubungan antar karakter, atau perkembangan cerita secara signifikan.",
  "impact": 1
}
Impact harus: 1 (positif), 0 (netral), -1 (negatif).
Tulis dampak yang menggambarkan perubahan signifikan pada cerita atau karakter.
Hanya balas dengan JSON. TANPA markdown.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return safeJsonParse(text);
}

export async function generateEnding(
  genre: string,
  context: string,
  karma: number
): Promise<string> {
  const prompt = `
Buat ending cerita bahasa Indonesia dengan genre "${genre}" dan konteks:
"${context}"

Berdasarkan nilai karma: ${karma} (positif = pilihan baik, negatif = pilihan buruk).
Pastikan ending yang dihasilkan jelas dan menyelesaikan semua garis besar cerita tanpa mengulang konflik atau pilihan yang telah dibuat sebelumnya. Ending harus memiliki penutupan yang memuaskan berdasarkan pilihan karakter, dengan dampak yang terasa nyata dari apa yang telah terjadi sepanjang cerita.
Jangan menggunakan frasa atau ide yang diulang-ulang. Setiap ending harus unik sesuai dengan jalannya cerita dan perkembangan karakter. Berikan penutupan yang memberi kesan akhir yang kuat dan jelas.
Tulis 1-2 paragraf yang menggambarkan bagaimana pilihan dan karma mempengaruhi nasib karakter dan arah cerita. Hindari pengulangan ide atau kata-kata yang digunakan dalam bagian sebelumnya.
Jangan gunakan markdown atau tanda \`\`\`. Balasan hanya isi cerita ending.
`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text.trim();
}
