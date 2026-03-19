package io.esecrets.capacitor.autofill.ui;

import android.annotation.SuppressLint;
import android.app.assist.AssistStructure;
import android.content.Intent;
import android.os.Bundle;
import android.service.autofill.Dataset;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.autofill.AutofillValue;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.getcapacitor.JSObject;
import com.sothree.slidinguppanel.SlidingUpPanelLayout;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import io.esecrets.capacitor.autofill.R;
import io.esecrets.capacitor.autofill.ViewParser;
import io.esecrets.capacitor.autofill.data.dao.FieldTypeDao;
import io.esecrets.capacitor.autofill.data.model.FieldType;
import io.esecrets.capacitor.autofill.data.model.SecretDataset;
import io.esecrets.capacitor.autofill.helper.CacheHelper;

import static android.app.Activity.RESULT_OK;
import static android.view.autofill.AutofillManager.EXTRA_ASSIST_STRUCTURE;
import static android.view.autofill.AutofillManager.EXTRA_AUTHENTICATION_RESULT;
import static io.esecrets.capacitor.autofill.helper.AutofillableFieldsHelper.getAutofillableFields;
import static io.esecrets.capacitor.autofill.helper.CacheHelper.addToCache;
import static io.esecrets.capacitor.autofill.helper.RemoteViewsHelper.simpleRemoteView;
import static io.esecrets.capacitor.autofill.helper.SecretDatasetHelper.getSecrets;

@SuppressLint("NewApi")
public class SecretListFragment extends Fragment {
  private static final String TAG = SecretListFragment.class.getSimpleName();

  private static final String ARG = "password";

  private String password;
  private List<FieldType> fields;
  private SlidingUpPanelLayout layout;
  private String clientPackageName;

  public SecretListFragment() {
  }

  public static SecretListFragment newInstance(String param1) {
    SecretListFragment fragment = new SecretListFragment();
    Bundle args = new Bundle();
    args.putString(ARG, param1);
    fragment.setArguments(args);
    return fragment;
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (getArguments() != null) {
      password = getArguments().getString(ARG);
    }
    Intent intent = getActivity().getIntent();
    AssistStructure assistStructure = (AssistStructure) intent.getParcelableExtra(EXTRA_ASSIST_STRUCTURE);
    ViewParser viewParser = new ViewParser(assistStructure);
    fields = getAutofillableFields(viewParser, FieldTypeDao.getInstance(getResources()));
    clientPackageName = assistStructure.getActivityComponent().getPackageName();
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    View view = inflater.inflate(R.layout.fragment_secret_list, container, false);
    setUpSlidingLayout(view);
    setUpRecyclerView(view);
    return view;
  }

  private void setUpSlidingLayout(View view) {
    layout = view.findViewById(R.id.sliding_layout);
    layout.addPanelSlideListener(new SlidingUpPanelLayout.PanelSlideListener() {
      @Override
      public void onPanelSlide(View panel, float slideOffset) {
        Log.i(TAG, "onPanelSlide, offset " + slideOffset);
      }

      @Override
      public void onPanelStateChanged(View panel, SlidingUpPanelLayout.PanelState previousState, SlidingUpPanelLayout.PanelState newState) {
        Log.i(TAG, "onPanelStateChanged " + newState);
//        if (newState == SlidingUpPanelLayout.PanelState.COLLAPSED)
//          getActivity().finish();
      }
    });
    layout.setFadeOnClickListener(_view -> {
      layout.setPanelState(SlidingUpPanelLayout.PanelState.COLLAPSED);
      getActivity().finish();
    });
  }

  private void setUpRecyclerView(View view) {
    RecyclerView recyclerView = view.findViewById(R.id.recycler);
    recyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
    recyclerView.setAdapter(new CustomAdapter(getSuggestedSecrets(), this::handItemClick));
  }

  private List<JSObject> getSuggestedSecrets() {
    List<JSObject> matchedSecrets = getMatchedSecrets();
    List<JSObject> suggestedSecrets = matchedSecrets.stream()
        .filter(this::isSecretNameMatchesClientPackageName)
        .collect(Collectors.toList());
    suggestedSecrets.addAll(matchedSecrets);
    return suggestedSecrets;
  }

  private List<JSObject> getMatchedSecrets() {
    return getSecrets(getContext(), password).stream()
        .filter(s -> fields.stream()
            .anyMatch(f -> s.getJSObject("content").has(f.name)))
        .collect(Collectors.toList());
  }

  private boolean isSecretNameMatchesClientPackageName(JSObject secret) {
    return Arrays.stream(clientPackageName.split("\\."))
        .anyMatch(s -> s.toUpperCase().contains(secret.getString("name").toUpperCase()));
  }

  private void handItemClick(JSObject item) {
    Log.i(TAG, "item click: " + item.getString("name"));
    addToCache(getContext(), clientPackageName, item.getString("name"));
    doResponse(getDataset(item));
  }

  private Dataset getDataset(JSObject item) {
    SecretDataset secretDataset = new SecretDataset(item, fields);
    Dataset.Builder dataset = new Dataset.Builder(simpleRemoteView(getActivity().getPackageName(), secretDataset.name));
    secretDataset.fields.forEach(field -> dataset.setValue(field.node.getAutofillId(), AutofillValue.forText(field.value)));
    return dataset.build();
  }

  private void doResponse(Dataset dataset) {
    Intent replyIntent = new Intent();
    replyIntent.putExtra(EXTRA_AUTHENTICATION_RESULT, dataset);
    getActivity().setResult(RESULT_OK, replyIntent);
    getActivity().finish();
  }

  public interface OnItemClickListener {
    void onItemClick(JSObject item);
  }
}