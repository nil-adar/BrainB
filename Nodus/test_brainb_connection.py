from db_connection import brainb_db

def test_connection():
    try:
        collections = brainb_db.list_collection_names()
        print("Connection to BrainBridge DB successful!")
        print("Collections:", collections)
    except Exception as e:
        print("Connection failed:", e)

if __name__ == "__main__":
    test_connection()
