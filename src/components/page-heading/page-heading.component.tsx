export function PageHeading({ title }: { title: string }) {
  return (
    <main className="flex flex-1 items-center justify-center">
      <h1 className="text-balance text-center text-3xl font-black tracking-tight text-ink sm:text-5xl">
        {title}
      </h1>
    </main>
  );
}
