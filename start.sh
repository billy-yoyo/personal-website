
cp -r ./infrastructure/. /etc/nginx/
sudo systemctl reload nginx

source .venv/bin/activate
python3 manage.py migrate --settings personal_website.settings.prod
python3 manage.py collectstatic --settings personal_website.settings.prod

pkill -f gunicorn
nohup gunicorn personal_website.wsgi --env DJANGO_SETTINGS_MODULE=personal_website.settings.prod &
