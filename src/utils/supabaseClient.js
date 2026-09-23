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

export async function deleteWishFromSupabase(id) {
  try {
    const { error } = await supabase
      .from('wishes')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('[Supabase] deleteWish warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] deleteWish error:', err);
    return false;
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

export async function deleteRsvpFromSupabase(id) {
  try {
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('[Supabase] deleteRsvp warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] deleteRsvp error:', err);
    return false;
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

/**
 * =========================================================
 * 4. PENGATURAN UMUM MEMPELAI (WEDDING SETTINGS)
 * =========================================================
 */
export async function fetchWeddingSettingsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('wedding_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    return {
      groomName: data.groom_name,
      groomFullName: data.groom_full_name,
      groomChildOrder: data.groom_child_order,
      groomParents: data.groom_parents,
      brideName: data.bride_name,
      brideFullName: data.bride_full_name,
      brideChildOrder: data.bride_child_order,
      brideParents: data.bride_parents,
      senderName: data.sender_name,
      defaultRecipientName: data.recipient_default_name || 'Bapak/Ibu/Saudara/i',
      weddingDate: data.wedding_date,
      weddingDateText: data.wedding_date_text,
      musicVolume: data.music_volume ? parseFloat(data.music_volume) : 0.20
    };
  } catch (err) {
    console.warn('[Supabase] fetchWeddingSettings error:', err);
    return null;
  }
}

export async function saveWeddingSettingsToSupabase(newData) {
  try {
    const payload = {
      groom_name: newData.groomName,
      groom_full_name: newData.groomFullName,
      groom_child_order: newData.groomChildOrder,
      groom_parents: newData.groomParents,
      bride_name: newData.brideName,
      bride_full_name: newData.brideFullName,
      bride_child_order: newData.brideChildOrder,
      bride_parents: newData.brideParents,
      sender_name: newData.senderName,
      recipient_default_name: newData.defaultRecipientName || newData.recipientName || 'Bapak/Ibu/Saudara/i',
      wedding_date: newData.weddingDate,
      wedding_date_text: newData.weddingDateText
    };

    const { data: existing } = await supabase.from('wedding_settings').select('id').limit(1).maybeSingle();
    if (existing?.id) {
      await supabase.from('wedding_settings').update(payload).eq('id', existing.id);
    } else {
      await supabase.from('wedding_settings').insert([payload]);
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] saveWeddingSettings error:', err);
    return false;
  }
}

/**
 * =========================================================
 * 5. DAFTAR TAMU & STATUS PENGIRIMAN (GUEST LIST & SENT STATUS)
 * =========================================================
 */
export async function fetchGuestsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('guest_list')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return null;

    const list = data.map(g => g.name);
    const sentMap = {};
    data.forEach(g => {
      if (g.is_sent) {
        sentMap[g.name] = true;
      }
    });

    return { list, sentMap };
  } catch (err) {
    console.warn('[Supabase] fetchGuests error:', err);
    return null;
  }
}

export async function saveGuestListToSupabase(guests) {
  try {
    if (!Array.isArray(guests) || guests.length === 0) return;
    for (const name of guests) {
      const trimmed = name.trim();
      if (!trimmed) continue;
      const { data: existing } = await supabase
        .from('guest_list')
        .select('id')
        .eq('name', trimmed)
        .limit(1);

      if (!existing || existing.length === 0) {
        await supabase.from('guest_list').insert([{ name: trimmed }]);
      }
    }
  } catch (err) {
    console.warn('[Supabase] saveGuestList error:', err);
  }
}

export async function deleteGuestFromSupabase(name) {
  try {
    await supabase.from('guest_list').delete().eq('name', name.trim());
  } catch (err) {
    console.warn('[Supabase] deleteGuest error:', err);
  }
}

export async function updateGuestSentStatusInSupabase(guestName, isSent) {
  try {
    await supabase
      .from('guest_list')
      .update({ is_sent: !!isSent, sent_at: isSent ? new Date().toISOString() : null })
      .eq('name', guestName.trim());
  } catch (err) {
    console.warn('[Supabase] updateGuestSentStatus error:', err);
  }
}

/**
 * =========================================================
 * 6. DAFTAR NAMA AMPLOP MASSAL (BULK ENVELOPES)
 * =========================================================
 */
export async function fetchBulkListFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('bulk_envelopes')
      .select('name')
      .order('order_index', { ascending: true });

    if (error || !data || data.length === 0) return null;
    return data.map(b => b.name);
  } catch (err) {
    console.warn('[Supabase] fetchBulkList error:', err);
    return null;
  }
}

export async function saveBulkListToSupabase(bulkList) {
  try {
    if (!Array.isArray(bulkList)) return;
    await supabase.from('bulk_envelopes').delete().neq('name', '___impossible___');
    const records = bulkList.map((name, index) => ({
      name: name.trim(),
      order_index: index + 1
    }));
    if (records.length > 0) {
      await supabase.from('bulk_envelopes').insert(records);
    }
  } catch (err) {
    console.warn('[Supabase] saveBulkList error:', err);
  }
}
