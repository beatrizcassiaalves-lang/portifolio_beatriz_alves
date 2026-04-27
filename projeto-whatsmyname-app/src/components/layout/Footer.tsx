export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-xl font-bold text-brand-dark mb-4">WhatsMyName App</h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md">
            WhatsMyName App - Professional OSINT tools platform for username discovery and email OSINT investigations. 
            Advanced OSINT search across 500+ platforms for digital identity mapping and footprint analysis.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-brand-dark mb-4">About</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-brand-purple transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-brand-purple transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-brand-purple transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-purple transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-brand-dark mb-4">Contact</h4>
          <p className="text-sm text-gray-500">
            Support: support@whatsmyname.net<br />
            Business: info@whatsmyname.net
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-200 flex flex-col md:row items-center justify-between gap-4">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} WhatsMyName App. All rights reserved.
        </p>
        <div className="flex gap-6">
          {/* Social icons could go here */}
        </div>
      </div>
    </footer>
  );
}
