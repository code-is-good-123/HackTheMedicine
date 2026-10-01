import Image from "next/image";

// Inside LoginPage component header section:
<div className="text-center">
  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 mb-4 p-2 shadow-sm border border-slate-200">
    <Image
      src="/logo.png"
      alt="Hack The Medicine Logo"
      width={40}
      height={40}
      className="object-contain"
      priority
    />
  </div>
  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
    Welcome back to Hack The Medicine
  </h2>
  <p className="text-sm text-slate-500 mt-1">
    Log in to track your doses and stay healthy
  </p>
</div>
