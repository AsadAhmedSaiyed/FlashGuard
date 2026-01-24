import guard from "@/lib/flashguard";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// 1. The Real DB Fetcher
const fetcher = async () => {
  // Real DB Call
  const snap = await getDoc(doc(db, "events", "concert_01"));
  return snap.exists() ? snap.data() : { tickets: 0 };
};

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const useShield = searchParams.get("shield") === "true"; 
  const requestCount = 50;
  
  let dbHits = 0;
  const start = Date.now();
  let leaderId = null; 

  const task = async (id) => {
    const reqStart = Date.now();
    let source = "COALESCED"; 
    let data = null;

    try {
      if (useShield) {
        // ✅ SHIELD ON
        data = await guard.fetch(
          "concert_tickets",
          async () => {
            dbHits++; 
            leaderId = id; 
          },
          { ttl: 60 }
        );
      } else {
        const chaos = Math.random() * 1000; 
        await new Promise(r => setTimeout(r, chaos));
        dbHits++;
        leaderId = id; 
        data = await fetcher();
      }

      // Check "Winner" status
      if (!useShield) source = "DATABASE";
      else if (id === leaderId) source = "DATABASE"; 

      return {
        id,
        status: "success",
        source, 
        duration: Date.now() - reqStart, 
      };

    } catch (err) {
      return { id, status: "error", duration: 0, error: err.message };
    }
  };

  try {
    // Run all 50 in parallel
    const promises = Array.from({ length: requestCount }).map((_, i) => task(i));
    const results = await Promise.all(promises);
    const duration = Date.now() - start;

    return NextResponse.json({
      success: true,
      mode: useShield ? "SHIELD ON" : "SHIELD OFF",
      totalRequests: requestCount,
      realDbReads: dbHits,
      duration: duration,
      results: results, 
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};