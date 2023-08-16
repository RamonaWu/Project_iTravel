from wtforms import StringField, PasswordField, DateField, IntegerField
from flask_wtf import FlaskForm
from wtforms.validators import DataRequired, Email, Length, optional


class SignupForm(FlaskForm):
    """Form for adding users."""

    username = StringField('Username', validators=[DataRequired()])
    email = StringField('E-mail', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[Length(min=6)])


class LoginForm(FlaskForm):
    """Login form."""

    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])


class SearchForm(FlaskForm):
    """Search form."""

    location = StringField('Location', validators=[DataRequired()])
    check_in = DateField('Check-in', validators=[DataRequired()])
    check_out = DateField('Check-out', validators=[DataRequired()])
    adults = IntegerField('Adults', validators=[DataRequired()])
    children = IntegerField('Children', validators=[optional()])
    rooms = IntegerField('Rooms', validators=[DataRequired()])