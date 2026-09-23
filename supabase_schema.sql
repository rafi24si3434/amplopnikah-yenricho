-- ==============================================================================
-- DATABASE SCHEMA LENGKAP PERNIKAHAN YENRICHO & VENI (SUPABASE POSTGRESQL)
-- ==============================================================================
-- File ini berisi DDL (CREATE TABLE), Index, RLS (Row Level Security),
-- Realtime Replication, Triggers, serta Data Awal (SEED DATA).
-- Jalankan skrip ini langsung di Supabase SQL Editor.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABEL: PENGATURAN UMUM PERNIKAHAN (wedding_settings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.wedding_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    groom_name TEXT NOT NULL DEFAULT 'Yenricho',
    groom_full_name TEXT NOT NULL DEFAULT 'Yenricho Noprian T Silaban',
    groom_child_order TEXT DEFAULT 'Putra pertama dari:',
    groom_parents TEXT DEFAULT 'Bapak B. Silaban & Ibu R. Panjaitan',
    bride_name TEXT NOT NULL DEFAULT 'Veni',
    bride_full_name TEXT NOT NULL DEFAULT 'Veni Gracia Br Sitanggang, S.Pd',
    bride_child_order TEXT DEFAULT 'Putri terakhir dari:',
    bride_parents TEXT DEFAULT 'Bapak A. Sitanggang & Ibu R. Manurung',
    sender_name TEXT DEFAULT 'Keluarga Besar Silaban & Sitanggang',
    recipient_default_name TEXT DEFAULT 'Bapak/Ibu/Saudara/i',
    wedding_date TIMESTAMPTZ NOT NULL DEFAULT '2026-10-03 10:00:00+07',
    wedding_date_text TEXT DEFAULT 'Sabtu, 03 Oktober 2026',
    music_url TEXT DEFAULT '/assets/music/wedding-song.mp3',
    music_volume NUMERIC(3,2) DEFAULT 0.20,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 3. TABEL: RANGKAIAN ACARA (wedding_events)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.wedding_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_key TEXT NOT NULL UNIQUE, -- 'pemberkatan', 'resepsi'
    title TEXT NOT NULL,
    date_text TEXT NOT NULL,
    time_text TEXT NOT NULL,
    venue TEXT NOT NULL,
    address TEXT NOT NULL,
    map_url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 4. TABEL: REKENING & AMPLOP DIGITAL (bank_accounts)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_name TEXT NOT NULL,
    bank_code TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_holder TEXT NOT NULL,
    logo_text TEXT,
    gradient_css TEXT,
    qr_code_url TEXT,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 5. TABEL: ALAMAT PENGIRIMAN KADO FISIK (gift_addresses)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.gift_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_name TEXT NOT NULL DEFAULT 'Yenricho & Veni',
    phone_number TEXT NOT NULL DEFAULT '085363578319',
    street_address TEXT NOT NULL,
    subdistrict_city_province TEXT NOT NULL,
    postal_code TEXT NOT NULL DEFAULT '28811',
    landmark TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 6. TABEL: KISAH PERJALANAN KASIH (love_stories)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.love_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_text TEXT NOT NULL,
    title TEXT NOT NULL,
    story_desc TEXT NOT NULL,
    photo_url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 7. TABEL: DAFTAR TAMU UNDANGAN (guest_list)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.guest_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    category TEXT DEFAULT 'Umum', -- 'Keluarga', 'Sahabat', 'VIP', 'Umum'
    pax INT DEFAULT 1,
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMPTZ,
    slug TEXT UNIQUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 8. TABEL: DAFTAR NAMA AMPLOP MASSAL (bulk_envelopes)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bulk_envelopes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 9. TABEL: RSVP / KONFIRMASI KEHADIRAN (rsvps)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name TEXT NOT NULL,
    attendance TEXT NOT NULL CHECK (attendance IN ('hadir', 'ragu', 'tidak')),
    event_choice TEXT DEFAULT 'keduanya' CHECK (event_choice IN ('pemberkatan', 'resepsi', 'keduanya')),
    guests_count INT DEFAULT 1,
    phone TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 10. TABEL: BUKU UCAPAN & DOA RESTU (wishes)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 11. TABEL: KONFIRMASI PENGIRIMAN KADO FISIK (gift_confirmations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.gift_confirmations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name TEXT NOT NULL,
    sender_phone TEXT,
    courier TEXT NOT NULL,
    tracking_number TEXT,
    gift_item TEXT DEFAULT 'Tanda Kasih Pernikahan',
    gift_message TEXT,
    channel TEXT DEFAULT 'Web' CHECK (channel IN ('Web', 'WhatsApp')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'acknowledged')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 12. INDEXES UNTUK PERFORMA TINGGI
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON public.wishes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gift_confirmations_created_at ON public.gift_confirmations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guest_list_name ON public.guest_list(name);
CREATE INDEX IF NOT EXISTS idx_guest_list_slug ON public.guest_list(slug);
CREATE INDEX IF NOT EXISTS idx_love_stories_order ON public.love_stories(order_index ASC);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_order ON public.bank_accounts(order_index ASC);

-- ==============================================================================
-- 13. AUTO UPDATE TIMESTAMP TRIGGER FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_wedding_settings_updated ON public.wedding_settings;
CREATE TRIGGER trigger_wedding_settings_updated
    BEFORE UPDATE ON public.wedding_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_guest_list_updated ON public.guest_list;
CREATE TRIGGER trigger_guest_list_updated
    BEFORE UPDATE ON public.guest_list
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_gift_addresses_updated ON public.gift_addresses;
CREATE TRIGGER trigger_gift_addresses_updated
    BEFORE UPDATE ON public.gift_addresses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Aktifkan RLS di setiap tabel
ALTER TABLE public.wedding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.love_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_envelopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_confirmations ENABLE ROW LEVEL SECURITY;

-- 14.1 Public READ untuk informasi website pernikahan
CREATE POLICY "Public Read Wedding Settings" ON public.wedding_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Wedding Events" ON public.wedding_events FOR SELECT USING (true);
CREATE POLICY "Public Read Bank Accounts" ON public.bank_accounts FOR SELECT USING (true);
CREATE POLICY "Public Read Gift Addresses" ON public.gift_addresses FOR SELECT USING (true);
CREATE POLICY "Public Read Love Stories" ON public.love_stories FOR SELECT USING (true);
CREATE POLICY "Public Read Guest List" ON public.guest_list FOR SELECT USING (true);
CREATE POLICY "Public Read Bulk Envelopes" ON public.bulk_envelopes FOR SELECT USING (true);
CREATE POLICY "Public Read RSVPs" ON public.rsvps FOR SELECT USING (true);
CREATE POLICY "Public Read Wishes" ON public.wishes FOR SELECT USING (true);
CREATE POLICY "Public Read Gift Confirmations" ON public.gift_confirmations FOR SELECT USING (true);

-- 14.2 Public INSERT untuk Tamu (RSVP, Wishes, Konfirmasi Kado)
CREATE POLICY "Public Insert RSVPs" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Wishes" ON public.wishes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Gift Confirmations" ON public.gift_confirmations FOR INSERT WITH CHECK (true);

-- 14.3 Full Access untuk Pengelolaan (Anon / Dashboard Admin)
-- Catatan: Kebijakan ini memungkinkan update & delete melalui aplikasi web admin
CREATE POLICY "Admin Full Access Settings" ON public.wedding_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Events" ON public.wedding_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Bank Accounts" ON public.bank_accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Gift Addresses" ON public.gift_addresses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Love Stories" ON public.love_stories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Guest List" ON public.guest_list FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Bulk Envelopes" ON public.bulk_envelopes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access RSVPs" ON public.rsvps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Wishes" ON public.wishes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Gift Confirmations" ON public.gift_confirmations FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 15. AKTIFKAN SUPABASE REALTIME (LIVE UPDATES)
-- ==============================================================================
-- Agar ucapan doa, RSVP, dan konfirmasi kado yang masuk muncul live seketika
ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gift_confirmations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guest_list;

-- ==============================================================================
-- 16. DATA AWAL (SEED DATA LENGKAP YENRICHO & VENI)
-- ==============================================================================

-- 16.1 Pengaturan Pernikahan
INSERT INTO public.wedding_settings (
    groom_name, groom_full_name, groom_child_order, groom_parents,
    bride_name, bride_full_name, bride_child_order, bride_parents,
    sender_name, wedding_date, wedding_date_text, music_url, music_volume
) VALUES (
    'Yenricho',
    'Yenricho Noprian T Silaban',
    'Putra pertama dari:',
    'Bapak B. Silaban & Ibu R. Panjaitan',
    'Veni',
    'Veni Gracia Br Sitanggang, S.Pd',
    'Putri terakhir dari:',
    'Bapak A. Sitanggang & Ibu R. Manurung',
    'Keluarga Besar Silaban & Sitanggang',
    '2026-10-03 10:00:00+07',
    'Sabtu, 03 Oktober 2026',
    '/assets/music/wedding-song.mp3',
    0.20
) ON CONFLICT DO NOTHING;

-- 16.2 Rangkaian Acara
INSERT INTO public.wedding_events (event_key, title, date_text, time_text, venue, address, map_url, order_index)
VALUES 
(
    'pemberkatan',
    'Pemberkatan Nikah',
    'Sabtu, 03 Oktober 2026',
    '10.00 WIB - Selesai',
    'Gereja HKBP Dame Ressort Dame Duri',
    'Jl. Perdamaian No. 37, Duri',
    'https://maps.google.com/?q=Gereja+HKBP+Dame+Ressort+Dame+Duri+Jl+Perdamaian+No+37',
    1
),
(
    'resepsi',
    'Resepsi Pernikahan',
    'Sabtu, 03 Oktober 2026',
    'Setelah Pemberkatan - Selesai',
    'Sopo Margurosi',
    'Jalan Sejahtera, Duri',
    'https://maps.google.com/?q=Sopo+Margurosi+Jalan+Sejahtera+Duri',
    2
)
ON CONFLICT (event_key) DO UPDATE 
SET title = EXCLUDED.title, date_text = EXCLUDED.date_text, time_text = EXCLUDED.time_text, venue = EXCLUDED.venue, address = EXCLUDED.address, map_url = EXCLUDED.map_url;

-- 16.3 Rekening & Amplop Digital
INSERT INTO public.bank_accounts (bank_name, bank_code, account_number, account_holder, logo_text, gradient_css, order_index)
VALUES
(
    'BRK Syariah',
    'BRK',
    '1044305092',
    'Veni Gracia',
    'BRK SYARIAH',
    'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
    1
),
(
    'Bank BRI',
    'BRI',
    '015901053960505',
    'Veni Gracia',
    'BANK BRI',
    'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    2
),
(
    'Bank Mandiri',
    'MANDIRI',
    '1720003644442',
    'YENRICHO NOPRIAN T S',
    'MANDIRI',
    'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
    3
),
(
    'Bank BRI',
    'BRI',
    '056001014927531',
    'Yenricho Noprian T S',
    'BANK BRI',
    'linear-gradient(135deg, #0284c7 0%, #0c4a6e 100%)',
    4
)
ON CONFLICT DO NOTHING;

-- 16.4 Alamat Pengiriman Kado
INSERT INTO public.gift_addresses (
    recipient_name, phone_number, street_address, subdistrict_city_province, postal_code, landmark
) VALUES (
    'Yenricho & Veni',
    '085363578319',
    'Jl. Diponegoro gang sentul ujung, (rumah pagar steinless putih)',
    'Kelurahan Rimba Sekampung, Kecamatan Dumai Kota, Kota Dumai, Riau',
    '28811',
    'Rumah pagar steinless putih'
) ON CONFLICT DO NOTHING;

-- 16.5 Kisah Kasih (Love Story)
INSERT INTO public.love_stories (year_text, title, story_desc, order_index)
VALUES
(
    'Awal 2023',
    'Awal Mula Perkenalan',
    'Kisah kami dimulai Awal tahun 2023, dari sebuah perkenalan singkat melalui seorang teman. Awalnya, kami hanya bertegur sapa dan bertukar pesan secara santai, mencoba saling mengenal satu sama lain di tengah kesibukan masing-masing.',
    1
),
(
    'Januari - April 2024',
    'Lost Contact dan menjalin hubungan',
    'Kami sempat kehilangan kontak dan berjalan di jalur masing-masing. Namun, jika memang sudah jalannya, takdir selalu punya cara untuk mempertemukan kembali. Memasuki  Januari Tahun 2024, sebuah pesan singkat kembali membuka komunikasi yang sempat terputus.\n\nPercakapan yang kembali mengalir hangat itu akhirnya membawa kami pada tatap muka pertama di awal Febuari Tahun 2024. Momen sederhana itu menjadi titik balik yang mengikis semua jarak dan rasa canggung. dan di bulan April tahun 2024 kami memutuskan untuk menjalin hubungan. Hari demi hari kami jalani bersama walaupun komunikasi  melalui virtual dan bertemu sekali dalam 3 minggu..',
    2
),
(
    'Januari - Oktober 2026',
    'Melangkah ke Jenjang Pernikahan',
    'Sejak hari itu, kami memutuskan untuk berjalan berdampingan. Menjalani hari-hari bersama, saling mengenal lebih dalam, hingga tumbuh rasa yakin bahwa kami telah menemukan pasangan hidup yang tepat. Setelah melalui proses bertumbuh bersama, kini dengan penuh rasa syukur dan mantap, lalu januari 2026 kami memutuskan untuk melangkah ke jenjang yang lebih serius: mengikat janji suci pernikahan di awal Oktober 2026 .',
    3
)
ON CONFLICT DO NOTHING;

-- 16.6 Tamu Cepat (Guest List)
INSERT INTO public.guest_list (name, category, pax, is_sent)
VALUES
('Bapak Ahmad & Keluarga', 'Umum', 2, false),
('Bapak Budi & Keluarga', 'Umum', 2, false),
('Ibu Siti & Keluarga', 'Umum', 2, false),
('Saudara Andi', 'Sahabat', 1, false),
('Saudara Rina', 'Sahabat', 1, false),
('Keluarga Besar Silaban', 'Keluarga', 5, false),
('Keluarga Besar Sitanggang', 'Keluarga', 5, false),
('Rekan Kerja & Sahabat', 'Sahabat', 2, false)
ON CONFLICT DO NOTHING;

-- 16.7 Amplop Cetak Massal (Bulk Envelopes)
INSERT INTO public.bulk_envelopes (name, order_index)
VALUES
('Bapak Ahmad & Keluarga', 1),
('Bapak Budi & Keluarga', 2),
('Ibu Siti & Keluarga', 3),
('Saudara Andi', 4),
('Saudara Rina', 5)
ON CONFLICT DO NOTHING;

-- 16.8 Ucapan & Doa Bawaan (Wishes)
INSERT INTO public.wishes (sender_name, message, is_approved)
VALUES
(
    'Maria Simanjuntak',
    'Selamat menempuh hidup baru Yenricho & Veni! Tuhan memberkati pernikahan dan keluarga kalian senantiasa. Horas! 🙏❤️',
    true
),
(
    'Parulian Situmorang',
    'Bahagia selalu Yenricho & Veni! Semoga menjadi keluarga yang rukun, penuh sukacita, dan diberkati Tuhan berlimpah-limpah. 💒✨',
    true
)
ON CONFLICT DO NOTHING;
