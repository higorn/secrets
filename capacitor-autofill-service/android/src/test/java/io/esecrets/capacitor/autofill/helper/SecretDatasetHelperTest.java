package io.esecrets.capacitor.autofill.helper;

import android.os.Parcel;
import android.os.Parcelable;

import com.getcapacitor.JSObject;

import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import io.esecrets.capacitor.autofill.data.dao.MockKvDao;
import io.esecrets.capacitor.autofill.data.dao.SecretDao;
import io.esecrets.capacitor.autofill.data.dao.VaultDao;
import io.esecrets.capacitor.autofill.data.model.FieldType;
import io.esecrets.capacitor.autofill.data.model.SecretDataset;
import io.esecrets.capacitor.autofill.data.security.Vault;

import static io.esecrets.capacitor.autofill.helper.SecretDatasetHelper.getSecretDatasets;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class SecretDatasetHelperTest {

  @Test
  public void shouldGetTheFieldsDataMap() {
    MockKvDao kvDao = new MockKvDao();
    Vault vault = new Vault(new VaultDao(kvDao));
    vault.unseal("123");
    SecretDao dao = new SecretDao(kvDao, vault);

    List<JSObject> secrets = dao.getAll();
    List<FieldType> fields = new ArrayList<>();
    fields.add(FieldType.of("username", "password", 8, Arrays.asList("user", "username")));
    fields.add(FieldType.of("password", "password", 1, Arrays.asList("pwd", "password")));

    List<SecretDataset> secretDatasets = getSecretDatasets(fields, secrets);

    assertNotNull(secretDatasets);
    assertEquals(1, secretDatasets.size());
  }

  static class TestParcelable implements Parcelable {

    @Override
    public int describeContents() {
      return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {

    }
  }
}