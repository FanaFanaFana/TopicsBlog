import User from "@models/user";
import { connectToDB } from "@utils/database";

export async function POST(req) {
  const { email, username, password } = await req.json();

  if (!email || !username || !password) {
    return new Response(
      JSON.stringify({ error: "All fields are required." }),
      { status: 400 }
    );
  }

  try {
    await connectToDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Email is already registered." }),
        { status: 400 }
      );
    }

    // Create a new user
    const newUser = await User.create({ email, username, password });

    return new Response(
      JSON.stringify({ message: "User registered successfully." }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Error during registration:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500 }
    );
  }
}
