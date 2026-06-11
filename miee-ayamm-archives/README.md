# Miee Ayamm Archives

Digital Library for College Assignments — dibangun dengan React + Vite + Tailwind CSS + Supabase.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment Variables

Buat file `.env` di root project:

```env
VITE_SUPABASE_URL=https://ljzrjqsuxfxanoctrekw.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Supabase

#### Buat tabel `tugas`:

```sql
create table tugas (
  id uuid default gen_random_uuid() primary key,
  judul text not null,
  semester integer not null,
  mata_kuliah text not null,
  deskripsi text,
  file_url text not null,
  file_name text,
  file_type text,
  file_size bigint,
  view_count integer default 0,
  download_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table tugas enable row level security;

-- Allow public read
create policy "Public read" on tugas for select using (true);

-- Allow public insert
create policy "Public insert" on tugas for insert with check (true);

-- Allow public update (untuk view/download count)
create policy "Public update" on tugas for update using (true);

-- Allow public delete
create policy "Public delete" on tugas for delete using (true);
```

#### Buat Storage Bucket `tugas-kuliah`:

1. Buka Supabase Dashboard → Storage
2. Buat bucket baru: **tugas-kuliah**
3. Set bucket sebagai **Public**
4. Tambahkan policy:

```sql
-- Allow public uploads
create policy "Public upload" on storage.objects for insert with check (bucket_id = 'tugas-kuliah');

-- Allow public read
create policy "Public read" on storage.objects for select using (bucket_id = 'tugas-kuliah');

-- Allow public delete
create policy "Public delete" on storage.objects for delete using (bucket_id = 'tugas-kuliah');
```

### 4. Jalankan development server

```bash
npm run dev
```

### 5. Build untuk production

```bash
npm run build
```

## Deploy ke Vercel

1. Push ke GitHub
2. Connect repo di Vercel
3. Tambahkan environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## Fitur

- Upload file (PDF, DOCX, PPTX, XLSX, JPG, PNG, ZIP, RAR)
- Preview PDF dan gambar langsung di browser
- Download file
- Salin & bagikan link
- QR Code untuk setiap file
- Pencarian real-time
- Filter semester, mata kuliah, jenis file
- Sorting: terbaru, terlama, nama A–Z
- Hapus file dengan password admin (`ktaeyvne`)
- Dark mode & light mode
- Loading skeleton
- Responsive mobile & desktop

## Password Admin

Password untuk menghapus file: **ktaeyvne**

---

© Miee Ayamm Archives
