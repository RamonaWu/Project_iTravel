from flask import Flask, redirect, render_template, flash, session, g, request
from flask_debugtoolbar import DebugToolbarExtension

from models import db, connect_db, User, Booking
from forms import SignupForm, LoginForm, SearchForm
from sqlalchemy.exc import IntegrityError
from listings import HotelListingFetcher

app = Flask(__name__)

app.app_context().push()

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///iTravel'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = "I'LL NEVER TELL!!"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

CURR_USER_KEY = "curr_user"

connect_db(app)
db.create_all()


###########################################################################
                      # For User signup/login/logout
@app.before_request
def add_user_to_g():
    """If we're logged in, add curr user to Flask global."""

    if CURR_USER_KEY in session:
        g.user = User.query.get(session[CURR_USER_KEY])
    else:
        g.user = None

def do_login(user):
    """Log in user."""

    session[CURR_USER_KEY] = user.id

def do_logout():
    """Logout user."""

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]


@app.route('/signup', methods=["GET", "POST"])
def signup():
    """Handle user signup.
    Create new user and add to DB. Redirect to home page.
    If form not valid, present form.
    If the there already is a user with that username: flash message
    and re-present form.
    """

    form = SignupForm()

    if form.validate_on_submit():
        try:
            user = User.signup(
                username=form.username.data,
                email=form.email.data,
                password=form.password.data,
            )
            db.session.commit()

        except IntegrityError:
            flash("Username already taken", 'danger')
            return render_template('user/signup.html', form=form)

        do_login(user)

        return redirect("/")

    else:
        return render_template('user/signup.html', form=form)
    

@app.route('/login', methods=["GET", "POST"])
def login():
    """Handle user login."""

    form = LoginForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data,
                                 form.password.data)

        if user:
            do_login(user)
            return redirect("/")
        
        flash("Invalid credentials.", 'danger')

    return render_template('user/login.html', form=form)


@app.route('/logout')
def logout():
    """Handle logout of user."""

    do_logout()
    flash("You have been logged out.")
    return redirect("/login")


@app.route('/user/<int:user_id>')
def user_detail(user_id):
    """Show user detail page."""

    user = User.query.get_or_404(user_id)

    return render_template('user/profile.html', user=user)


@app.route('/user/<int:user_id>/edit', methods=["GET", "POST"])
def edit_profile(user_id):
    """Edit user profile"""

    user = User.query.get_or_404(user_id)

    if g.user == user:
        form = SignupForm(obj=user)

        if form.validate_on_submit():
            user.username = form.username.data
            user.email = form.email.data
            user.password = form.password.data

            db.session.commit()
            return redirect(f"/user/{user.id}")
        
        return render_template('user/edit_profile.html', form=form, user=user)

    flash("Access unauthorized.", "danger")
    return redirect("/")


###########################################################################
                      # For hotel listing
# homepage /
# listing /search
# hotel_detail /hotel/<int:hotel_id>
# booking /hotel/<int:user_id>/booking

@app.route("/")
def homepage():
    """Show homepage."""

    return render_template("home.html")


@app.route("/search", methods=["GET", "POST"])
def list_hotels():
    """ list all search hotels"""

    form = SearchForm()

    if form.validate_on_submit():
        location = form.location.data
        check_in = form.check_in.data
        check_out = form.check_out.data
        adults = form.adults.data
        children = form.children.data
        rooms = form.rooms.data

        listings = HotelListingFetcher()

        hotel_listing = listings.getHotelListings(location, check_in, check_out, adults, children, rooms)

        return render_template("listing.html", hotel_listing=hotel_listing)
    
    return render_template("home.html", form=form)




# @app.route("/hotel/<int:hotel_id>", methods=["GET"])
# def hotel_details(hotel_id):
#     """Show hotel details"""
#     room_list = request.args.get('room_list')
    
#     return render_template("hotel_detail.html", room_list=room_list)



# @app.route("/hotel/<int:user_id>/bookings", methods=['POST'])
# def booking(user_id):
#     """Show booking page"""

#     if not g.user:
#         flash("Access unauthorized.", "danger")
#         return redirect("/")

#     user = User.query.get_or_404(user_id)

#     if g.user == user:
#         hotel_name = request.form.get('hotel-name')
#         start_date = request.form.get('start_date')
#         end_date = request.form.get('end_date')
#         total_cost = request.form.get('total_cost')

#         booking = Booking(
#             user_id=user_id,
#             hotel_name=hotel_name,
#             start_date=start_date,
#             end_date=end_date,
#             total_cost= total_cost
#         )

#         db.session.add(booking)
#         db.session.commit()

#         return render_template("booking.html")
    
#     flash("Access unauthorized.", "danger")
#     return redirect("/")

