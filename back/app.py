from asyncio import events
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import uuid # for public id
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask_marshmallow import Marshmallow
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)

app.config['SECRET_KEY'] = 'secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///p0.db'
cors = CORS(app, resources={r"*":{"origins":"*"}})
db = SQLAlchemy(app)
ma = Marshmallow(app)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    id_user = db.Column(db.String(50))
    name = db.Column(db.String(100))
    place = db.Column(db.String(100))
    address = db.Column(db.String(100)) 
    date_start = db.Column(db.DateTime())
    date_end = db.Column(db.DateTime())
    virtual = db.Column(db.Boolean())

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    public_id = db.Column(db.String(50), unique = True)
    email = db.Column(db.String(100), unique = True)
    password = db.Column(db.String(100))

class Event_Schema(ma.Schema):

    class Meta:

        fields = ('id','id_user', 'name', 'place', 'address', 'date_start', 'date_end', 'virtual')

post_schema = Event_Schema()

posts_schema = Event_Schema(many=True)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        print(request.headers)
        token = None
        if 'X-Access-Token' in request.headers:
            token = request.headers['X-Access-Token']
        if not token:
            return jsonify({'message' : 'Token is missing !!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = User.query\
				.filter_by(public_id = data['public_id'])\
				.first()
        except:
            return jsonify({
				'message' : 'Token is invalid !!'
			}), 401
        return f(current_user, *args, **kwargs)

    return decorated

@app.route('/login',methods=['POST'])
def login():
    auth = request.json

    if not auth or not auth['email'] or not auth['password']:
        return make_response(
			'Could not verify',
			401,
			{'WWW-Authenticate' : 'Basic realm ="Login required !!"'}
		)

    user = User.query.filter_by(email = auth['email']).first()

    if not user:
        return make_response(
			'Could not verify',
			401,
			{'WWW-Authenticate' : 'Basic realm ="User does not exist !!"'}
		)

    if check_password_hash(user.password, auth['password']):
        token = jwt.encode({
			'public_id': user.public_id,
			'exp' : datetime.utcnow() + timedelta(minutes = 30)
		}, app.config['SECRET_KEY'])
        return make_response(jsonify({'email':user.email, 'token' : token.decode('UTF-8')}), 201)
    
    return make_response(
		'Could not verify',
		403,
		{'WWW-Authenticate' : 'Basic realm ="Wrong Password !!"'}
	)

@app.route('/signup',methods=['POST'])
def signup():
    data = request.json

    email, password = data['email'], data['password']

    user = User.query.filter_by(email = email).first()
    if not user:
        user = User(
			public_id = str(uuid.uuid4()),
			email = email,
			password = generate_password_hash(password)
		)   
        db.session.add(user)
        db.session.commit()
        token = jwt.encode({
			'public_id': user.public_id,
			'exp' : datetime.utcnow() + timedelta(minutes = 30)
		}, app.config['SECRET_KEY'])
        return make_response(jsonify({'email':user.email,'token' : token.decode('UTF-8')}), 201)
    else:
        return make_response('User already exists. Please Log in.', 202)
        
@app.route('/users',methods=['GET'])
def get_all_users():
    
    users = User.query.all()
    output = []
    
    for user in users:
        output.append({
            'public_id': user.public_id,
            'email' : user.email
        })

    return jsonify({'users': output})
        
@app.route('/user',methods=['GET'])
def get_user():
    user_email = request.args.get("user")
    user = User.query.filter_by(email = user_email).first()
    return jsonify({"email":user.email,  "public_id": user.public_id})
    
@app.route('/events',methods=['GET'])
@token_required
def get_all_events_by_user(current_user):
    events = Event.query.filter(Event.id_user == current_user.public_id).all()
    return {"events":posts_schema.dump(events)}
  

@app.route('/events',methods=['POST'])
@token_required
def post_event_by_user(current_user):
    new_event = Event(id_user=current_user.public_id, name=request.json['name'],
            place=request.json['place'], address=request.json['address'],
            date_start=datetime.strptime(request.json['date_start'],'%Y-%m-%d'),
            date_end=datetime.strptime(request.json['date_end'],'%Y-%m-%d'),
            virtual=request.json['virtual'] )
    db.session.add(new_event)
    db.session.commit()
    return post_schema.dump(new_event)
    
@app.route('/events/<event_id>',methods=['PUT'])
@token_required
def put_event_by_user(current_user,event_id):
    event = Event.query.get_or_404(event_id)
    if 'name' in request.json:
        event.name = request.json['name']
    if 'place' in request.json:
        event.place = request.json['place']
    if 'address' in request.json:
        event.address = request.json['address']
    if 'date_start' in request.json:
        event.date_start = datetime.strptime(request.json['date_start'],'%Y-%m-%d')
    if 'date_end' in request.json:
        event.date_end = datetime.strptime(request.json['date_end'],'%Y-%m-%d')
    if 'virtual' in request.json:
        event.virtual = request.json['virtual']
    db.session.commit()
    return post_schema.dump(event)

@app.route('/events/<event_id>',methods=['DELETE'])
@token_required
def delete_event_by_user(current_user,event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return '',204
    
if __name__ == "__main__":
	app.run(debug = True)
