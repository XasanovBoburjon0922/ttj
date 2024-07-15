import React from 'react'

function Statistic() {
  return (
    <div className="flex flex-wrap" id="gradient-Analytics">
    <div className="w-full sm:w-1/2 lg:w-1/4 p-4">
        <div className="bg-gradient-to-r from-orange-600 to-orange-400 shadow-lg text-white p-4 rounded-md mt-5">
            <div className="flex">
                <div className="w-2/3">
                    
                    <p>Orders</p>
                </div>
                <div className="w-1/3 text-right">
                    <h5 className="mb-0 text-white">690</h5>
                    <p className="m-0">New</p>
                    <p>6,00,00</p>
                </div>
            </div>
        </div>
    </div>
    <div className="w-full sm:w-1/2 lg:w-1/4 p-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-400 shadow-lg text-white p-4 rounded-md mt-5">
            <div className="flex">
                <div className="w-2/3">
                    
                    <p>Clients</p>
                </div>
                <div className="w-1/3 text-right">
                    <h5 className="mb-0 text-white">1885</h5>
                    <p className="m-0">New</p>
                    <p>1,12,900</p>
                </div>
            </div>
        </div>
    </div>
    <div className="w-full sm:w-1/2 lg:w-1/4 p-4">
        <div className="bg-gradient-to-r from-purple-600 to-orange-400 shadow-lg text-white p-4 rounded-md mt-5">
            <div className="flex">
                <div className="w-2/3">
                    
                    <p>Sales</p>
                </div>
                <div className="w-1/3 text-right">
                    <h5 className="mb-0 text-white">80%</h5>
                    <p className="m-0">Growth</p>
                    <p>3,42,230</p>
                </div>
            </div>
        </div>
    </div>
    <div className="w-full sm:w-1/2 lg:w-1/4 p-4">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg text-white p-4 rounded-md mt-5">
            <div className="flex">
                <div className="w-2/3">
                    <p>Profit</p>
                </div>
                <div className="w-1/3 text-right">
                    <h5 className="mb-0 text-white">$890</h5>
                    <p className="m-0">Today</p>
                    <p>$25,000</p>
                </div>
            </div>
        </div>
    </div>
</div>

  )
}

export default Statistic