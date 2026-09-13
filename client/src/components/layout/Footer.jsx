import { Link } from 'react-router-dom';
export default function Footer() {
  return <footer className="border-t border-slate-200 bg-[#e8edf4] mt-12 py-10 px-6">
    <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-6 text-sm text-slate-600">
      <div><p className="font-black text-lg text-slate-900">FastLance</p><p className="mt-2">Connect, collaborate, and deliver.</p><p className="mt-1">10% platform commission. 90% payable to the freelancer.</p></div>
      <nav aria-label="Footer" className="flex flex-wrap gap-5"><Link to="/services">Services</Link><Link to="/freelancers">Freelancers</Link><Link to="/dashboard">Workspace</Link></nav>
      <p>© {new Date().getFullYear()} FastLance</p>
    </div>
  </footer>;
}
