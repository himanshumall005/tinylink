const { PrismaClient } = require('@prisma/client'); 
(async () =
  const p = new PrismaClient(); 
  try { 
    await p.$connect(); 
    const count = await p.link.count().catch(()=
    console.log('Prisma connected, link count =', count); 
  } catch (e) { 
    console.error('Prisma runtime error:', e); 
  } finally { 
    await p.$disconnect(); 
  } 
})(); 
