import Questionnaire from '@/app/components/questionnaire.component';

// TODO:
// [X] fix side buttons
// [X] fix circular translate
// [X] Update circular translate to use parabolic func
// [X] Switch back and skip to arrows
// [X] Progress bar
// [X] Fix animations stuck after one
// [X] Make responsive
// [X] Add FastAPI server + connect
// [X] Split into client and server components
// [X] Refactor code into components
// [X] github
// [ ] Extract components from questionnaire
// [ ] Deploy to vercel
// [ ] Update headers and metadata
// [ ] Add readme with task tracking
// [ ] Add JWS tokens (or other encryption) for api
// [ ] Fix routing
// [ ] Add QR code
// [ ] Fix 'not defined' for client-side functions on the server render
// [ ] Fix image boxing to not cover buttons
// [ ] add entry / final conditions
// [ ] add cat animations

export default async function Main() {
  return (
    <Questionnaire/>
  );
}