package io.esecrets.capacitor.autofill.ui;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.getcapacitor.JSObject;

import org.jetbrains.annotations.NotNull;

import java.util.Iterator;
import java.util.List;

import io.esecrets.capacitor.autofill.R;

public class CustomAdapter extends RecyclerView.Adapter<CustomAdapter.ViewHolder> {

  private final List<JSObject> dataset;
  private final SecretListFragment.OnItemClickListener clickListener;

  public static class ViewHolder extends RecyclerView.ViewHolder {
    private final View view;
    private final ImageView icon;
    private final TextView title;
    private final TextView subtitle;

    public ViewHolder(View v) {
      super(v);
      this.view = v;
      this.icon = v.findViewById(R.id.icon);
      this.title = v.findViewById(R.id.title);
      this.subtitle = v.findViewById(R.id.subtitle);
    }

    public ImageView getIcon() {
      return icon;
    }

    public TextView getTitle() {
      return title;
    }

    public TextView getSubtitle() {
      return subtitle;
    }

    public void bind(JSObject item, SecretListFragment.OnItemClickListener clickListener) {
      this.view.setOnClickListener((view) -> clickListener.onItemClick(item));
    }
  }

  public CustomAdapter(List<JSObject> dataset, SecretListFragment.OnItemClickListener clickListener) {
    this.dataset = dataset;
    this.clickListener = clickListener;
  }

  @NotNull
  @Override
  public ViewHolder onCreateViewHolder(@NonNull @NotNull ViewGroup parent, int viewType) {
    return new ViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.secret_list_item, parent, false));
  }

  @Override
  public void onBindViewHolder(@NonNull @NotNull ViewHolder holder, int position) {
    JSObject item = dataset.get(position);
    JSObject content = item.getJSObject("content");
    Context context = holder.getIcon().getContext();
    holder.getIcon().setImageResource(context.getResources().getIdentifier(
        "ic_" + item.getString("type"), "drawable", context.getPackageName()));
    holder.getTitle().setText(content.getString("title"));
    Iterator<String> keys = content.keys();
    keys.next();
    if (keys.hasNext()) {
      holder.getSubtitle().setText(content.getString(keys.next()));
    }
    holder.bind(item, clickListener);
  }

  @Override
  public int getItemCount() {
    return dataset.size();
  }
}
