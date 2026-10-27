import logging
import numpy as np
from typing import List, Tuple, Any, Optional, Dict

logger = logging.getLogger(__name__)

class SemanticEmbeddingEngine:
    _instance = None
    _model = None
    _cache: Dict[str, np.ndarray] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SemanticEmbeddingEngine, cls).__new__(cls)
        return cls._instance

    def _load_model(self):
        if self._model is None:
            try:
                from fastembed import TextEmbedding
                logger.info("Initializing fastembed TextEmbedding (BAAI/bge-small-en-v1.5)...")
                # fastembed loads onnx runtime model locally and caches to ~/.cache
                self._model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
                logger.info("Semantic vector embedding engine initialized successfully.")
            except Exception as e:
                logger.warning(f"Could not initialize fastembed model: {e}. Falling back to n-gram similarity.")
                self._model = False
        return self._model

    def embed_text(self, text: str) -> Optional[np.ndarray]:
        clean_text = text.strip()
        if not clean_text:
            return None
            
        if clean_text in self._cache:
            return self._cache[clean_text]

        model = self._load_model()
        if model:
            try:
                embeddings = list(model.embed([clean_text]))
                if embeddings:
                    vec = np.array(embeddings[0], dtype=np.float32)
                    norm = np.linalg.norm(vec)
                    if norm > 0:
                        vec = vec / norm
                    self._cache[clean_text] = vec
                    return vec
            except Exception as e:
                logger.error(f"Error generating embedding for '{clean_text}': {e}")
        return None

    def compute_similarity(self, text_a: str, text_b: str) -> float:
        vec_a = self.embed_text(text_a)
        vec_b = self.embed_text(text_b)

        if vec_a is not None and vec_b is not None:
            return float(np.dot(vec_a, vec_b))

        # Fallback: Character 3-gram Jaccard similarity if vector model unavailable
        return self._fallback_ngram_similarity(text_a, text_b)

    def _fallback_ngram_similarity(self, a: str, b: str) -> float:
        a_clean = a.lower().strip()
        b_clean = b.lower().strip()
        if not a_clean or not b_clean:
            return 0.0
        if a_clean == b_clean or a_clean in b_clean or b_clean in a_clean:
            return 0.9

        def get_ngrams(s: str, n: int = 3):
            return set(s[i:i+n] for i in range(max(1, len(s) - n + 1)))

        ngrams_a = get_ngrams(a_clean)
        ngrams_b = get_ngrams(b_clean)
        union = len(ngrams_a | ngrams_b)
        if not union:
            return 0.0
        return len(ngrams_a & ngrams_b) / union

    def find_best_semantic_match(
        self,
        query: str,
        candidates: List[Tuple[str, Any]],
        threshold: float = 0.65
    ) -> Tuple[Optional[Any], float, Optional[str]]:
        """
        Takes a query string and a list of (candidate_text, candidate_obj) tuples.
        Returns (best_obj, similarity_score, candidate_text) if score >= threshold,
        otherwise (None, best_score, best_candidate_text).
        """
        if not candidates or not query.strip():
            return None, 0.0, None

        best_obj = None
        best_score = 0.0
        best_text = None

        query_vec = self.embed_text(query)

        for candidate_text, candidate_obj in candidates:
            if not candidate_text:
                continue

            # 1. Exact match check (short-circuit)
            if query.lower().strip() == candidate_text.lower().strip():
                return candidate_obj, 1.0, candidate_text

            cand_vec = self.embed_text(candidate_text)
            if query_vec is not None and cand_vec is not None:
                sim = float(np.dot(query_vec, cand_vec))
            else:
                sim = self._fallback_ngram_similarity(query, candidate_text)

            if sim > best_score:
                best_score = sim
                best_text = candidate_text
                best_obj = candidate_obj

        if best_score >= threshold:
            return best_obj, best_score, best_text
        return None, best_score, best_text

_semantic_engine = SemanticEmbeddingEngine()

def get_semantic_engine() -> SemanticEmbeddingEngine:
    return _semantic_engine
