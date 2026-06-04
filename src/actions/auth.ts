"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function syncUserRole(role: "citizen" | "authority") {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // If role is not set, or is different, update it
    if (user.publicMetadata.role !== role) {
      await client.users.updateUser(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          role
        }
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error syncing role:", err);
    return { success: false, error: err.message || "Failed to sync role" };
  }
}
