import requests
from base64 import b64encode

def connection_api(fecha):
	url_api = f'http://---.com/{fecha}'
	user = '---'
	password = '---'
	headers = {
		"Authorization": "Basic {}".format(
			b64encode(bytes(f"{user}:{password}", "utf-8")).decode("ascii")
		)
	}
	r = requests.get(url=url_api, headers=headers)
	return r