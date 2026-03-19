package io.esecrets.capacitor.autofill;

import android.annotation.SuppressLint;
import android.app.assist.AssistStructure;

import java.util.Collections;
import java.util.List;

@SuppressLint("NewApi")
public class ViewParser {
  private final List<AssistStructure> structures;

  public ViewParser(List<AssistStructure> structures) {
    this.structures = structures;
  }

  public ViewParser(AssistStructure structure) {
    this(Collections.singletonList(structure));
  }

  public void parse(ViewNodeProcessor processor) {
    structures.forEach(struct -> {
      int nodes = struct.getWindowNodeCount();
      AssistStructure.ViewNode prevNode = null;
      for (int i = 0; i < nodes; i++) {
        AssistStructure.ViewNode node = struct.getWindowNodeAt(i).getRootViewNode();
        traverseRoot(node, prevNode, processor);
        prevNode = node;
      }
    });
  }

  private void traverseRoot(AssistStructure.ViewNode viewNode, AssistStructure.ViewNode prevNode,
                            ViewNodeProcessor processor) {
    processor.processNode(viewNode, prevNode);
    int childrenSize = viewNode.getChildCount();
    if (childrenSize == 0)
      return;
    AssistStructure.ViewNode _prevNode = prevNode;
    for (int i = 0; i < childrenSize; i++) {
      AssistStructure.ViewNode node = viewNode.getChildAt(i);
      traverseRoot(node, _prevNode, processor);
      _prevNode = node;
    }
  }

  public interface ViewNodeProcessor {
    void processNode(AssistStructure.ViewNode node, AssistStructure.ViewNode prevNode);
  }
}
