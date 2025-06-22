const categories = [
    "Artificial Intelligence",
    "Cyber Security",
    "SaaS",
    "Medical Technology",
    "Software/IT Consulting"
  ]
  
  // You would want to replace this with a real list of counties
  const counties = [
    "Abbeville", "Aiken", "Allendale", "Anderson", "Bamberg", "Barnwell", "Beaufort", "Berkeley", "Calhoun", "Charleston",
    "Cherokee", "Chester", "Chesterfield", "Clarendon", "Colleton", "Darlington", "Dillon", "Dorchester", "Edgefield",
    "Fairfield", "Florence", "Georgetown", "Greenville", "Greenwood", "Hampton", "Horry", "Jasper", "Kershaw", "Lancaster",
    "Laurens", "Lee", "Lexington", "Marion", "Marlboro", "McCormick", "Newberry", "Oconee", "Orangeburg", "Pickens",
    "Richland", "Saluda", "Spartanburg", "Sumter", "Union", "Williamsburg", "York"
  ]
  
  // Placeholder business data
  const businesses = [
    {
      name: "InnovateAI",
      category: "Artificial Intelligence",
      county: "Charleston",
      description: "AI solutions for business automation."
    },
    {
      name: "CyberSafe SC",
      category: "Cyber Security",
      county: "Greenville",
      description: "Protecting SC businesses from cyber threats."
    }
    // ...more businesses
  ]
  
  export function BusinessDirectory() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
        {/* Filters */}
        <aside className="w-1/3 max-w-xs">
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Category</h2>
            <ul>
              {categories.map(cat => (
                <li key={cat}>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="form-checkbox" />
                    <span>{cat}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">County</h2>
            <select className="w-full px-2 py-2 rounded border">
              <option value="">All Counties</option>
              {counties.map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
          </div>
        </aside>
  
        {/* Business Cards */}
        <section className="w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {businesses.map(biz => (
            <div key={biz.name} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">{biz.name}</h3>
              <div className="text-sm text-gray-500 mb-1">{biz.category} • {biz.county} County</div>
              <p className="text-gray-700">{biz.description}</p>
            </div>
          ))}
        </section>
      </div>
    )
  }