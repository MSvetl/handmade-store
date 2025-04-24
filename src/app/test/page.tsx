import type { NextPage } from 'next';

const TestPage: NextPage = (): JSX.Element => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Тестовая страница</h1>
      <p className="mt-4">Если вы видите этот текст, значит страница загружается корректно.</p>
    </div>
  );
};

export default TestPage; 