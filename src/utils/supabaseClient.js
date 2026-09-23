import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://grbfqcyxhtzuvitdraep.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyYmZxY3l4aHR6dXZpdGRyYWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNDI0NTksImV4cCI6MjEwNTcxODQ1OX0.mpEwdwJ34a03PsQseM0Qhzw1bRyS-2a4HhFObxmFtYE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

/**
 * =========================================================
 * 1. BUKU UCAPAN & DOA (WISHES)
 * =========================================================
 */
export async function fetchWishesFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchWishes warning:', error.message);
      return null;
    }
    return data.map(item => ({
      id: item.id,
      name: item.sender_name,
      message: item.message,
      time: item.created_at
    }));
  } catch (err) {
    console.warn('[Supabase] fetchWishes error:', err);
    return null;
  }
}

export async function insertWishToSupabase(name, message) {
  try {
    const { data, error } = await supabase
      .from('wishes')
      .insert([
        {
          sender_name: name.trim(),
          message: message.trim()
        }
      ])
      .select();

    if (error) {
      console.warn('[Supabase] insertWish warning:', error.message);
      return null;
    }
    return data?.[0] || null;
  } catch (err) {
    console.warn('[Supabase] insertWish error:', err);
    return null;
  }
}

/**
 * =========================================================
 * 2. RSVP / KONFIRMASI KEHADIRAN
 * =========================================================
 */
export async function insertRsvpToSupabase(rsvpData) {
  try {
    const rawAttendance = (rsvpData.attendance || 'hadir').toLowerCase();
    const attendance = ['hadir', 'ragu', 'tidak'].includes(rawAttendance) ? rawAttendance : 'hadir';

    const rawChoice = (rsvpData.eventChoice || 'keduanya').toLowerCase();
    const eventChoice = ['pemberkatan', 'resepsi', 'keduanya'].includes(rawChoice) ? rawChoice : 'keduanya';

    const payload = {
      guest_name: (rsvpData.name || 'Tamu').trim(),
      attendance: attendance,
      event_choice: eventChoice,
      guests_count: parseInt(rsvpData.guests, 10) || 1,
      phone: rsvpData.phone?.trim() || null,
      notes: rsvpData.notes?.trim() || null
    };

    const { data, error } = await supabase
      .from('rsvps')
      .insert([payload])
      .select();

    if (error) {
      console.warn('[Supabase] insertRsvp warning:', error.message);
      return null;
    }
    return data?.[0] || null;
  } catch (err) {
    console.warn('[Supabase] insertRsvp error:', err);
    return null;
  }
}

export async function fetchRsvpsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchRsvps warning:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[Supabase] fetchRsvps error:', err);
    return null;
  }
}

/**
 * =========================================================
 * 3. KONFIRMASI PENGIRIMAN KADO FISIK
 * =========================================================
 */
export async function fetchGiftConfirmationsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('gift_confirmations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] fetchGiftConfirmations warning:', error.message);
      return null;
    }
    return data.map(item => ({
      id: item.id,
      senderName: item.sender_name,
      senderPhone: item.sender_phone,
      courier: item.courier,
      trackingNumber: item.tracking_number,
      giftItem: item.gift_item,
      giftMessage: item.gift_message,
      channel: item.channel,
      status: item.status,
      timestamp: item.created_at
    }));
  } catch (err) {
    console.warn('[Supabase] fetchGiftConfirmations error:', err);
    return null;
  }
}

export async function insertGiftConfirmationToSupabase(entry) {
  try {
    const rawChannel = (entry.channel || 'Web').toLowerCase();
    const channel = rawChannel.includes('wa') || rawChannel.includes('whatsapp') ? 'WhatsApp' : 'Web';

    const payload = {
      sender_name: (entry.senderName || 'Tamu').trim(),
      sender_phone: entry.senderPhone?.trim() || null,
      courier: entry.courier || 'Lainnya',
      tracking_number: entry.trackingNumber?.trim() || null,
      gift_item: entry.giftItem?.trim() || 'Tanda Kasih Pernikahan',
      gift_message: entry.giftMessage?.trim() || null,
      channel: channel
    };

    console.log('[Supabase] Sending gift confirmation payload:', payload);

    const { data, error } = await supabase
      .from('gift_confirmations')
      .insert([payload])
      .select();

    if (error) {
      console.error('[Supabase] insertGiftConfirmation error:', error.message, error);
      return null;
    }
    console.log('[Supabase] insertGiftConfirmation successful:', data);
    return data?.[0] || null;
  } catch (err) {
    console.error('[Supabase] insertGiftConfirmation catch error:', err);
    return null;
  }
}

export async function deleteGiftConfirmationFromSupabase(id) {
  try {
    const { error } = await supabase
      .from('gift_confirmations')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('[Supabase] deleteGiftConfirmation warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] deleteGiftConfirmation error:', err);
    return false;
  }
}
