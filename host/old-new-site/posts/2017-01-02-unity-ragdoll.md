# Unity ragdoll

So i am playing with Unity3D for some time now and trying to make everything by myself, not using the asset store.

I am working on a game concept (FPS) and i wanted to create a ragdoll on an animated character.

If you already tried out the built in Ragdoll wizard, you will recognize it is an automated Joint/Rigidbody creator.

So the following script should help to solve the transitioning:

```C#
using UnityEngine;

public class RagdollController : MonoBehaviour {
    public void DisableRagdoll() {
        GetComponent<Animator>().enabled = true;

        foreach(Rigidbody rb in GetComponentsInChildren<Rigidbody>()) {
            rb.isKinematic = true;
        }
    }

    public void EnableRagdoll() {
        GetComponent<Animator>().enabled = false;

        foreach(Rigidbody rb in GetComponentsInChildren<Rigidbody>()) {
            rb.isKinematic = false;
        }
    }
}
```

You can also find this script on gist [here](https://gist.github.com/chrisakakay/413e0bfcb6b21af577f9e711eefda958).
