"""Test suite for The Mentalist Databricks App
Validates data integrity, routes, status codes, and search.
"""
import pytest
from fastapi.testclient import TestClient
import os
import sys

# Ensure app path is accessible
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "app")))
from main import app, DATA_CACHE, load_data

@pytest.fixture(scope="module", autouse=True)
def setup_test_data():
    load_data()

@pytest.fixture
def client():
    return TestClient(app)

def test_data_integrity():
    """Verify that all 6 datasets loaded cleanly and have records."""
    assert DATA_CACHE["show"]["title"] == "The Mentalist"
    assert len(DATA_CACHE["seasons"]) == 7
    assert len(DATA_CACHE["episodes"]) == 151
    assert len(DATA_CACHE["characters"]) >= 10
    assert len(DATA_CACHE["season_cast"]) > 0
    assert len(DATA_CACHE["awards"]) > 0

def test_home_page(client):
    """Test Screen 1: Home page loads with 200 OK."""
    response = client.get("/")
    assert response.status_code == 200
    assert "He sees what others miss" in response.text
    assert "Start with the Pilot" in response.text
    assert "Seasons" in response.text

def test_episodes_page(client):
    """Test Screen 2: Episodes explorer loads with season filters."""
    response = client.get("/episodes?season=1&sort=order")
    assert response.status_code == 200
    assert "Pilot" in response.text
    assert "US viewers by episode" in response.text

    # Test sorting
    response_highest = client.get("/episodes?season=3&sort=highest")
    assert response_highest.status_code == 200

def test_episode_detail_page(client):
    """Test Screen 3: Episode Detail loads with credits and bar charts."""
    response = client.get("/episodes/tm_s06e08") # Red John episode
    assert response.status_code == 200
    assert "Red John" in response.text
    assert "S6 E8" in response.text
    assert "Credits" in response.text

def test_compare_page(client):
    """Test Screen 4: Head-to-Head Comparison page loads."""
    response = client.get("/compare?ep1=tm_s03e24&ep2=tm_s06e08")
    assert response.status_code == 200
    assert "Compare episodes" in response.text
    assert "IMDb rating" in response.text

def test_characters_page(client):
    """Test Screen 5: Characters page groups by team/household."""
    response = client.get("/characters")
    assert response.status_code == 200
    assert "Patrick Jane" in response.text
    assert "Teresa Lisbon" in response.text
    assert "CBI Core Team" in response.text

def test_awards_page(client):
    """Test Screen 6: Awards page loads."""
    response = client.get("/awards")
    assert response.status_code == 200
    assert "Awards &amp; Accolades" in response.text or "Awards" in response.text

def test_about_page(client):
    """Test Screen 7: About page renders 5 tiers and live ER table row counts."""
    response = client.get("/about")
    assert response.status_code == 200
    assert "Built on Databricks" in response.text
    assert "Data model" in response.text
    assert "151 rows" in response.text # Live episode row count

def test_api_search(client):
    """Test full-text search API."""
    response = client.get("/api/search?q=Jane")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) > 0
