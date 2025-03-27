import { Routes, Route } from 'react-router-dom';
import Finished from './routes/finished';

import NotFound from './routes/not-found';

const App = () => {
  return (
    <main>
      <Routes>
        <Route path='/'>
          <Route index element={<Finished />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </main>
  );
};

export default App;
