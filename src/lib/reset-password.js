import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email, recovery_code, new_password } = req.body;

    if (!email || !recovery_code || !new_password) {
      return res
        .status(400)
        .json({ error: "Email, recovery_code and new_password are required" });
    }

    // Znajdź usera po emailu
    const { data: users, error: userError } =
      await supabase.auth.admin.listUsers({
        email,
      });

    if (userError) {
      throw userError;
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];

    // Sprawdź recovery_code w user_metadata
    const storedCode = user.user_metadata?.recovery_code;

    if (!storedCode || storedCode !== recovery_code) {
      return res.status(403).json({ error: "Invalid recovery code" });
    }

    // Zmień hasło i usuń recovery_code (ustaw na null)
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        password: new_password,
        user_metadata: {
          ...user.user_metadata,
          recovery_code: null,
        },
      }
    );

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
