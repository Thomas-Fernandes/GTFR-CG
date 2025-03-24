from flask import Blueprint
from flask_restx import Api

from src.docs import ns_cards_generation
from src.constants.paths import API_ROUTE, ROUTES

from src.routes.cards_generation.generate import bp_cards_generation_generate
from src.routes.cards_generation.generate_single import bp_cards_generation_generate_single
from src.routes.cards_generation.save_cards_contents import bp_cards_generation_save_cards_contents

bp_cards_generation = Blueprint(ROUTES.cards_gen.bp_name, __name__.split('.')[-1])
bp_cards_generation.register_blueprint(bp_cards_generation_save_cards_contents)
bp_cards_generation.register_blueprint(bp_cards_generation_generate)
bp_cards_generation.register_blueprint(bp_cards_generation_generate_single)


def addCardsGenerationNamespace(api: Api) -> None:
    """Initializes the cards generation blueprint"""
    api_prefix = API_ROUTE + ROUTES.cards_gen.path
    api.add_namespace(ns_cards_generation, path=api_prefix)
