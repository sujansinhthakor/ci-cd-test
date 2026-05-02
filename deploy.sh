cd ci-cd-test
git pull origin main
npm install
npm run build
pm2 delete next-app || true
pm2 start npm --name "my-next-app" -- start
