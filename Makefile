build:
	cd frontend
	npm i
	cd ..
	pwd
	pip install -r backend/requirements.txt

run_frontend:
	cd frontend && npm start

run_backend:
	cd backend && python3 app.py
