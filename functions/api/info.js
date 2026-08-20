export async function onRequest(context) {
  const data = {
    decompileTarget: 'NTSC-U GoldenEye 007',
    romArtifact: 'build/u/ge007.u.z64',
    expectedSha1: 'abe01e4aeb033b6c0836819f549c791b26cfde83',
    toolchain: 'Recompiled SGI IDO 5.3 + GCC MIPS',
    coreEngine: 'Mupen64Plus-Next (WASM)',
    cloudflareFunctions: 'Active'
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  });
}
