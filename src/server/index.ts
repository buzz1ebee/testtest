import { Devvit } from '@devvit/public-api';
import './main';
Devvit.configure({ redis: true });
export default Devvit;
