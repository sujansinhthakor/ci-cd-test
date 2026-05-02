script: |
        # 1. Navigate and Update
        cd ~/ci-cd-test
        git pull origin main
        
        # 2. Fresh Install and Build
        npm install
        npm run build
        
        # 3. Kill any manual process that might be hogging the port
        sudo fuser -k 3000/tcp || true
        
        # 4. Use PM2 correctly
        # We delete by name to ensure a clean start
        pm2 delete "my-next-app" || true
        
        # We use -- to pass the 'start' argument to npm
        pm2 start npm --name "my-next-app" -- start
        
        # 5. This forces the script to display the table and EXIT the SSH session
        pm2 list