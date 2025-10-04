# Sampling Methods Practice

Inspired by studying sampling techniques in OpenIntro Statistics.

---

## The Four Methods

### Random Sampling
Just pick points randomly - the simplest approach.

```python
sampler.random_sampling(data, n_samples=30)
```

### Stratified Sampling
Make sure each class gets represented equally.

```python
sampler.stratified_sampling(data, labels, n_samples_per_class=10)
```

### Cluster Sampling
Group similar things together first, then take whole groups.

```python
sampler.clustered_sampling(data, n_clusters=3)
```

### Multi-Stage Sampling
Cluster first, then sample from each cluster - kind of a hybrid approach.

```python
sampler.multi_stage_sampling(data, n_clusters=3, n_samples_per_cluster=5)
```

---

## Testing with Iris

Used the classic Iris dataset (150 flowers, 3 species) to see how each method behaves.

PCA reduces it to 2D so we can actually visualize what's happening.

---

## What I Noticed

**Random** can miss entire classes if you're unlucky with small samples.

**Stratified** is really reliable - always get balanced representation.

**Clustering** shows the natural structure, which is cool but doesn't always match the true labels.

**Multi-stage** gives you a bit of both worlds - structure plus sampling efficiency.

---

## Running It

```bash
python run.py
```

Outputs one plot showing all five views side by side.