import flashguard from "@/lib/flashguard";
import {db} from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";


export const GET = async (req) =>{
   const {searchParams} = new URL(req.url);
   const useShield = searchParams.get('shield') === 'true';
   const start = Date.now();
   try{
     const result = await flashguard('concert_tickets',async()=>{
        await new Promise(res => setTimeout(res, 1000));
        const snap = await getDoc(doc(db,"events","concert_01"));
        return snap.exists() ? snap.data() : {tickets: 0};
     }, useShield);
     return NextResponse.json({
        success:true,
        ...result,
        latency:Date.now()-start
     });
   }catch(err){
     return NextResponse.json({error:err.message},{status:500});
   }
};