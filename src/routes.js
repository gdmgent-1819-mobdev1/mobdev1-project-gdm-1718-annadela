// Pages
import HomeView from './pages/home';
import FirebaseView from './pages/firebase-example';
import MapboxView from './pages/mapbox-example';
import FormView from './pages/form';
import LoginView from './pages/login';
import StartView from './pages/start';
import NieuwKotView from './pages/nieuwKot';
import DetailPageView from './pages/detailPage';
import ProfileView from './pages/profile';
import LijstView from './pages/lijst';
import KaartView from './pages/kaart';
import FavorietView from './pages/favo';
import ChoseView from './pages/chosekot';
import BerichtenView from './pages/berichten';
import VerstuurView from './pages/verstuur';
import BekijkView from './pages/bekijk';
import TinderView from './pages/tinderspel';

export default [
  { path: '/', view: HomeView },
  { path: '/firebase', view: FirebaseView },
  { path: '/mapbox', view: MapboxView },
  { path: '/form', view: FormView },
  { path: '/login', view: LoginView },
  { path: '/start', view: StartView },
  { path: '/nieuwKot', view: NieuwKotView },
  { path: '/detailPage', view: DetailPageView },
  { path: '/profile', view: ProfileView },
  { path: '/lijst', view: LijstView },
  { path: '/kaart', view: KaartView },
  { path: '/favo', view: FavorietView },
  { path: '/chosekot', view: ChoseView },
  { path: '/berichten', view: BerichtenView },
  { path: '/verstuur', view: VerstuurView },
  { path: '/bekijk', view: BekijkView },
  { path: '/tinderspel', view: TinderView },
];
