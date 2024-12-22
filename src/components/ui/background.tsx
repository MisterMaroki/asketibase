'use client';

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black/90" />
      
      {/* Primary gradient orb */}
      <div 
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(171, 76%, 75%, 0.15), transparent 70%)',
          filter: 'blur(40px)'
        }}
      />
      
      {/* Secondary gradient orb */}
      <div 
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full animate-float-delayed"
        style={{
          background: 'radial-gradient(circle, hsl(165, 42%, 61%, 0.15), transparent 70%)',
          filter: 'blur(40px)'
        }}
      />
      
      {/* Accent gradient orb */}
      <div 
        className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full animate-float"
        style={{
          background: 'radial-gradient(circle, hsl(197, 3%, 51%, 0.1), transparent 70%)',
          filter: 'blur(40px)'
        }}
      />
    </div>
  );
}