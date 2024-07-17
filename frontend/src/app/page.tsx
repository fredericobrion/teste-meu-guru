export default function Home() {
  return (
    <div className="container mx-auto">
    <form className="flex flex-col items-center mt-16">
      <input type="email" placeholder="E-mail" id="email" className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none my-4" />
      <input type="password" placeholder="Senha" id="password" className="rounded-md border border-gray-300 px-4 py-2 focus:shadow-purple-500 focus:shadow-sm focus:outline-none" />
      <button type="submit" className="bg-purple-500 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-600 hover:scale-105 cursor-pointer mt-4">Entrar</button>
    </form>
  </div>
  );
}
