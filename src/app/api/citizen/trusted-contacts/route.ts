import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Citizen from "@/models/Citizen";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "citizen") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await Citizen.findById(session.id).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, trustedContacts: user.trustedContacts || [] }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Trusted Contacts Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "citizen") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, phone, email } = await req.json();
    if (!name || !phone) return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });

    await dbConnect();
    const user = await Citizen.findById(session.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.trustedContacts && user.trustedContacts.length >= 3) {
      return NextResponse.json({ error: "Maximum of 3 trusted contacts allowed" }, { status: 400 });
    }

    if (!user.trustedContacts) {
      user.trustedContacts = [];
    }

    user.trustedContacts.push({ name, phone, email });
    await user.save();

    return NextResponse.json({ success: true, trustedContacts: user.trustedContacts }, { status: 200 });
  } catch (error: any) {
    console.error("Add Trusted Contact Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "citizen") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { contactId, name, phone, email } = await req.json();
    if (!contactId || !name || !phone) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    await dbConnect();
    const user = await Citizen.findById(session.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const contact = user.trustedContacts.id(contactId);
    if (!contact) return NextResponse.json({ error: "Contact not found" }, { status: 404 });

    contact.name = name;
    contact.phone = phone;
    contact.email = email;
    await user.save();

    return NextResponse.json({ success: true, trustedContacts: user.trustedContacts }, { status: 200 });
  } catch (error: any) {
    console.error("Update Trusted Contact Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "citizen") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { contactId } = await req.json();
    if (!contactId) return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });

    await dbConnect();
    const user = await Citizen.findById(session.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    user.trustedContacts.pull({ _id: contactId });
    await user.save();

    return NextResponse.json({ success: true, trustedContacts: user.trustedContacts }, { status: 200 });
  } catch (error: any) {
    console.error("Delete Trusted Contact Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
