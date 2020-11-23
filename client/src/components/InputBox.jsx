export default () => 
	<div class="flex-shrink flex flex-row bg-gray-100 rounded-lg border-blue-400 border-4">
		<div class="flex-none flex items-center m-5">
			<svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
		</div>
		<input class="text-2xl bg-transparent outline-none" placeholder=" Scan your barcode" />
		<a href="#" class="flex-none flex items-center m-2 p-2 rounded cursor-pointer bg-blue-400 text-gray-200 hover:bg-blue-300 hover:text-white hover:shadow-md focus:bg-blue-600 focus:shadow-inner">
			<svg class="w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
		</a>
	</div>
