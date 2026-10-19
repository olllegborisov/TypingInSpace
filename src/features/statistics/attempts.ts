
import { supabase } from '../../lib/supabase';

type NewAttempt = {
    duration_seconds: number;
    correct_count: number;
    error_count: number;
    };

    export async function saveAttempt(attempt: NewAttempt) {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;
    if (!data.user) throw new Error('Необходимо войти в аккаунт');

    const { error: insertError } = await supabase
        .from('attempts')
        .insert({
        user_id: data.user.id,
        ...attempt,
        });
    if (insertError) throw insertError;
    }

    export async function getAttempts() {
    const { data, error } = await supabase
        .from('attempts')
        .select('id, played_at, duration_seconds, correct_count, error_count')
        .order('played_at', { ascending: false });

    if (error) throw error;

    return data;
}
